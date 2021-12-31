. "$(dirname "$0")/functions.sh"
setup
install

# Should not fail
rm -rf .hg
expect 0 "npx --no-install husky install"
