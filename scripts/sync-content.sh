#!/bin/sh
# Copy the book's markdown from the source repository into this site.
#
# The site vendors the prose rather than building from a checkout of the book,
# so that `pnpm dev` and `pnpm build` work standalone. The cost is that the copy
# goes stale: run this after the book changes, then commit the result.
#
# Usage:
#   ./scripts/sync-content.sh [path-to-public-value-guide]
#
# The default path assumes the two repositories are siblings:
#   public-value-guide/
#   ├── public-value-guide/            <- the book
#   └── public-value-guide.github.io/  <- this site

set -eu

here=$(cd "$(dirname "$0")/.." && pwd)
source_repo=${1:-"$here/../public-value-guide"}
locales_dir="$source_repo/locales"

if [ ! -d "$locales_dir" ]; then
    echo "No locales/ directory under $source_repo" >&2
    echo "Pass the path to the book repository as the first argument." >&2
    exit 1
fi

destination="$here/src/content"

# GLOSSARY.md and INDEX.md are not localized in the book repo — one copy,
# shared across every locale on the site.
cp "$source_repo/GLOSSARY.md" "$destination/GLOSSARY.md"
cp "$source_repo/INDEX.md" "$destination/INDEX.md"

# Remove first so a locale or chapter removed upstream is removed here too,
# rather than lingering as an orphaned page the picker or sidebar still links
# to.
rm -rf "$destination/locales"
mkdir -p "$destination/locales"

# Each chapter is its own directory upstream (`chapters/<NN-NN-slug>/index.md`,
# alongside `.locale-peer-id` and a `README.md -> index.md` symlink — the
# locale-peer-id convention, see spec/index.md §4a upstream). Only `index.md`
# matters to the site's markdown glob (`$lib/server/book.ts`), but copying the
# whole chapter directory is simpler than picking files apart and the extra
# files are harmless — they are never read at build time.
total=0
for locale_path in "$locales_dir"/*/; do
    slug=$(basename "$locale_path")
    if [ ! -d "${locale_path}chapters" ]; then
        continue
    fi
    # Skip a locale that has been scaffolded (directories exist) but has no
    # chapter content synced upstream yet, so an empty locale never appears to
    # exist on the site.
    if ! find "${locale_path}chapters" -mindepth 2 -maxdepth 2 -name index.md -size +0c | grep -q .; then
        echo "Skipping locale $slug: no non-empty chapters yet"
        continue
    fi
    mkdir -p "$destination/locales/$slug/chapters"
    # No trailing slash on the source glob: with one, cp copies each chapter
    # directory's *contents* into the destination (flattening every chapter's
    # index.md into one shared file); without one, cp preserves each chapter
    # directory as its own named subdirectory of the destination, which is
    # what the site's glob (chapters/*/index.md) expects.
    cp -R "${locale_path}chapters/"* "$destination/locales/$slug/chapters/"
    count=$(find "$destination/locales/$slug/chapters" -name index.md -size +0c | wc -l | tr -d ' ')
    total=$((total + count))
    echo "Synced $count chapters for locale $slug"
done

echo "Synced $total chapter files across all locales, plus the glossary and the index, from $source_repo"
echo "Review with: git -C \"$here\" status"
echo "Remember: add any newly-complete locale to LOCALES in src/lib/book.ts before it will show up in the site's navigation."
