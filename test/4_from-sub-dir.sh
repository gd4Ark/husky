. "$(dirname "$0")/functions.sh"
setup

# from sub directory add hook and commit

# Example:
# .hg
# sub/package.json

# Edit package.json in sub directory
mkdir sub
cd sub
npm install ../../husky.tgz
cat >package.json <<EOL
{
	"scripts": {
		"prepare": "cd .. && husky install"
	}
}
EOL

# Install
npm run prepare

# Add hook
npx --no-install husky add pre-commit "echo \"pre-commit hook\" && exit 1"

# Test pre-commit
hg add package.json
expect 255 "hg commit -m foo"
