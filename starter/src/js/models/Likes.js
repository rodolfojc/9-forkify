export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike (id, title, author, img) {
        const like = {id, title, author, img};
        this.likes.push(like);

        // PERSIST THE DATA IN LOCAL STORAGE
        this.persistData();

        return like;
    }

    deleteItem (id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // PERSIST THE DATA IN LOCAL STORAGE
        this.persistData();

    }

    isLiked (id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes () {
        this.likes.length;
    }

    persistData () {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage () {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // RESTORING LIKES FROM LOCAL STORAGE
        if (storage) this.likes = storage;
    }

}