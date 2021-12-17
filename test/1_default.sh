. "$(dirname "$0")/functions.sh"
setup
install

npx --no-install husky install

# Test pre-commit
hg add package.json
npx --no-install husky add pre-commit "echo \"pre-commit\" && exit 1"
expect 255 "hg commit -m foo"

# Uninstall
npx --no-install husky uninstall
expect 1 "cat ./.hg/hgrc | grep 'hooks'"
