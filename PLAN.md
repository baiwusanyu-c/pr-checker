1.能够记忆登录 ✔
2.所有仓库冲突pr 查看
3.所有仓库 pr 一键merge
4.所有仓库 pr 选择 merge
// 
4.选择仓库仓库冲突pr 查看
5.选择仓库 pr 一键merge
6.选择仓库 pr 选择 merge

pr merge from main/master

- `pr-checker -t <token>` set the token of GitHub. **token is a required**. see [new personal access token](https://github.com/settings/tokens/new?scopes=repo)
- `pr-checker -u <username>` set the author name of PRs
- `pr-checker -c ` clear token  and username
- `pr-checker -s <owner/repo> [-u <username>]` list the PRs which has conflicts


                            yes 列出所有pr检测结果 -》 对所有仓库#1
选择检测所有pr还是按照仓库检测？ -》
                            no 列出仓库进行选择 -》 #2


                           yes 一键合并
#1 对所有pr 进行自动 merge ？ 
                            no pr 选择，进行合并

#2 选择仓库 -》 冲突检测 -》根据仓库#1

# 1.0.0
# 1.1.0
一键更新
# 1.1.1
优化错误检测