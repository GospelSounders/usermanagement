# access-control for Gospel Sounders Publishing sites

Access Control for Gospel Sounders Publishing Sites.

## Requirements

Due to the dearth of resources, we have chosen to design and build our systems in such a way that it can be possible to host them (including databases) for free (on free services) online. Also due to the scarcity of time, we have opted to re-use as much as possible, not only code, but any free part of any service that can serve as an implementation of any part of the design of any of our systems. For the present system we have used:

1. [Thingsboard](https://demo.thingsboard.io/)
2. [Github pages](https://github.com/)
3. [Cors Proxy](https://cors-anywhere.herokuapp.com/), [cseco.co.ke:8080](http://cseco.co.ke:8080), [cors.cseco.co.ke](https://cors.cseco.co.ke:8080). Used to overcome chrome Cross-Origin issues.
4. [JSON Proxy](https://github.com/csymapp/jsonproxy) - check jsonproxy server in rule rule chain. Required because rule nodes do not accept text as input. Also proxy for octokit.

***Note***

Thingsboard serves the dual purpose of providing an implementation of RBAC and `free hosting` on [Thingsboard](https://demo.thingsboard.io/). For security of the data, however, it is recommended that if and when resources shall avail, the thingsboard server be changed to a private one.

## Description

This access control system is intended to authenticate and authorize users on any GS publishing system (lessons, translation, main GS-publications, etc). 

## Steps Undertaken

1. Created tenant account on [Thingsboard](https://demo.thingsboard.io/) using things****@g****s.org (check vault for this email)
2. Created `UserManagement` device profile
3. Created `UserManagement` Device in `UserManagement` device profile
4. Saved tb credentials (tb_tenant_email, tb_tenant_password) in `server attributes` of device (so that they can only be accessible from rule chain). Other attributes:
- tb_tenant_email - tenant admin email
- tb_tenant_password - tenant admin password
- GitOwner GospelSounders - github organization
- GitRepo access_control_rule_chains - github repo
- GitRepoForApplications applications-list - github repo
- [JSONPROXY](https://github.com/csymapp/jsonproxy) https://jsonproxy.cseco.co.ke - server running jsonproxy (with github api proxy as well)
- SSLGitkey - github api key
- TBSERVER https://demo.thingsboard.io - tb server. So rulechains can be imported into any server
- APPLICATIONNAME GS Publications - name of customer
5. Created relation for each ruleChain: FROM contains device `UserManagement`. Rule chains are pushed every time there is a change. They can be imported from github to any server.
6. Created ${APPLICATION NAME} customer
7. Get token of public `UserManagement` device and put in application
8. Build `quasar build` and copy `dist/spa` to docs


## Deleting an application

Does not delete project files

## Note

***User data will be deleted if account on [thingsboard demo](https://demo.thingsboard.io) is deleted.*** Therefore this should be changed as soon as it is done.

## Todo
- [ ] Editing Applications. Not enabled in tb API
