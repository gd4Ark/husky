. "$(dirname "$0")/functions.sh"
setup
install

mkdir .husky

cd .husky

touch pre-commit

chmod +x pre-commit

cat >pre-commit <<EOL
echo "pre-commit" && exit 1
EOL

cd ..

npx --no-install husky install

# Test hooks installed
expect 0 "cat ./.hg/hgrc | grep 'pre-commit='"

expect 255 "hg commit -m foo"

# Uninstall
npx --no-install husky uninstall
expect 1 "cat ./.hg/hgrc | grep 'hooks'"
