. "$(dirname "$0")/functions.sh"
setup
install

h="pre-commit"
f="./.husky/pre-commit"

npx --no-install husky install

npx --no-install husky add $h "foo"
grep -m 1 _ $f && grep foo $h && ok

npx --no-install husky add $h "bar"
grep -m 1 _ $f && grep foo $f && grep bar $f && ok

npx --no-install husky set $h "baz"
grep -m 1 _ $f && grep foo $f || grep bar $f || grep baz $f && ok
