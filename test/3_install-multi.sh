. "$(dirname "$0")/functions.sh"
setup
install

npx --no-install husky install

# Test pre-commit
npx --no-install husky add pre-commit "echo \"pre-commit\" && exit 1"

# Test multiple install will not be repeated write hooks
npx --no-install husky install
npx --no-install husky install
npx --no-install husky install

count=$(cat ./.hg/hgrc | grep -c 'pre-commit=')

assert 1 $count

# Uninstall
npx --no-install husky uninstall
expect 1 "cat ./.hg/hgrc | grep 'hooks'"
