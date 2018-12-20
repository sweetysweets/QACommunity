package com.nju.zhihu.Entity;

public class FollowUser {

    private int fuid;
    private int uid;
    private int userfollowedid;

    public FollowUser(int fuid, int uid, int userfollowedid) {
        this.fuid = fuid;
        this.uid = uid;
        this.userfollowedid = userfollowedid;
    }

    public FollowUser() {
    }

    public int getFuid() {
        return fuid;
    }

    public void setFuid(int fuid) {
        this.fuid = fuid;
    }

    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    public int getUserfollowedid() {
        return userfollowedid;
    }

    public void setUserfollowedid(int userfollowedid) {
        this.userfollowedid = userfollowedid;
    }
}
