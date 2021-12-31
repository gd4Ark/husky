set -e
npm run build
npm pack && mv husky-*.tgz /tmp/husky.tgz

sh test/1_default.sh
sh test/2_install.sh
sh test/3_install-multi.sh
sh test/4_from-sub-dir.sh
sh test/5_set-add.sh
sh test/6_set-add-multi.sh
sh test/7_not-hg-dir.sh
sh test/8_hg_command_not_found.sh
