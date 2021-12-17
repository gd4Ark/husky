. "$(dirname "$0")/functions.sh"
setup
install

h1="hook1"
h2="hook1"

f1="./.husky/$h1"
f2="./.husky/$h2"

npx --no-install husky install

npx --no-install husky add $h1 "h1-foo"
grep -m 1 _ $f1 && grep h1-foo $h1 && ok

npx --no-install husky add $h2 "h2-foo"
grep -m 1 _ $f1 && grep h1-foo $h1 && ok
grep -m 1 _ $f2 && grep h2-foo $h2 && ok

# Test hooks installed
expect 0 "cat ./.hg/hgrc | grep $h1="
expect 0 "cat ./.hg/hgrc | grep $h2="
