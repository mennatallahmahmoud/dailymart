import axios from "axios";

export default {
    data() {
        return {
            products: null,
            categories: null,
            cart: null,
            wishlist: null
        }
    },
    methods: {
        async getLoggedUser(userId) {
            return (await (axios.get(`https://dailymart-5c550-default-rtdb.firebaseio.com/users/${userId}.json`))).data
        },
        async planSubscribe(userId, object) {
            return (await (axios.patch(`https://dailymart-5c550-default-rtdb.firebaseio.com/users/${userId}.json`, object))).data
        },
        async getAllProducts(searchQuery, categoryId, boycottOrNot) {
            this.products = (await axios.get('https://dailymart-5c550-default-rtdb.firebaseio.com/products.json')).data

            if (!boycottOrNot) {
                if (searchQuery) {
                    this.products = this.products.filter(item => item[1].english_name.toLowerCase().includes(searchQuery.toLowerCase()))
                }
                return this.products
            }
            else {

                if (categoryId) {
                    this.products = Object.entries(this.products).filter(item => item[1].catId == categoryId && !item[1].boycott)
                }
                else {
                    this.products = Object.entries(this.products).filter(item => !item[1].boycott)
                }

                if (searchQuery) {
                    this.products = this.products.filter(item => item[1].english_name.toLowerCase().includes(searchQuery.toLowerCase()))
                }
                return this.products
            }

        }
        ,
        async getCategories() {
            this.categories = (await axios.get(`https://dailymart-5c550-default-rtdb.firebaseio.com/category.json`)).data
            return Object.entries(this.categories)
        }
        ,
        async get_cart_wishlist_weekly(userId, cart_wishlist_weekly) {
            return (await axios.get(`https://dailymart-5c550-default-rtdb.firebaseio.com/${cart_wishlist_weekly}/${userId}.json`)).data
        }
        ,
        async addTo_cart_wishlist_weekly(userId, productId, product, cart_wishlist_weekly) {
            return (await (axios.put(`https://dailymart-5c550-default-rtdb.firebaseio.com/${cart_wishlist_weekly}/${userId}/${productId}.json`, product))).data
        }
        ,
        async deleteItem_cart_wishlist_weekly(userId, productId, cart_wishlist_weekly) {
            return (await axios.delete(`https://dailymart-5c550-default-rtdb.firebaseio.com/${cart_wishlist_weekly}/${userId}/${productId}.json`))
        }
        ,
        async clear_cart_wishlist_weekly(userId, cart_wishlist_weekly) {
            return (await axios.delete(`https://dailymart-5c550-default-rtdb.firebaseio.com/${cart_wishlist_weekly}/${userId}/.json`))
        }
        ,
        async getSpeificProduct(userId, productId, cart_wishlist) {
            return (await axios.get(`https://dailymart-5c550-default-rtdb.firebaseio.com/${cart_wishlist}/${userId}/${productId}/.json`)).data
        }
        ,
        async patchQuantity(userId, productId, cart_wishlist_weekly, sign) {
            let quantity = (await axios.get(`https://dailymart-5c550-default-rtdb.firebaseio.com/${cart_wishlist_weekly}/${userId}/${productId}/quantity.json`)).data
            let modifiedQuantity = null

            if (sign == '+') {
                modifiedQuantity = quantity + 1
            }
            else {
                modifiedQuantity = quantity - 1
            }
            if (modifiedQuantity == 0) {
                return this.deleteItem_cart_wishlist_weekly(userId, productId, cart_wishlist_weekly)
            }
            else {
                return (await axios.patch(`https://dailymart-5c550-default-rtdb.firebaseio.com/${cart_wishlist_weekly}/${userId}/${productId}/.json`, { quantity: modifiedQuantity })).data
            }
        }
        ,
        getNextFriday() {
            const now = new Date();
            const dayOfWeek = now.getDay(); // Get current day of the week (0 is Sunday, 6 is Saturday)
            const daysUntilFriday = (5 - dayOfWeek + 7) % 7; // Calculate how many days until Friday
            const nextFriday = new Date();
            nextFriday.setDate(now.getDate() + daysUntilFriday);
            nextFriday.setHours(23, 59, 59, 999) // Set the time to 11:59:59 PM
            return nextFriday;
        },


        //Admin

        async deleteProduct(productId) {
            return (await axios.delete(`https://dailymart-5c550-default-rtdb.firebaseio.com/products/${productId}/.json`)).data
        },
        async getProduct(productId) {
            return (await axios.get(`https://dailymart-5c550-default-rtdb.firebaseio.com/products/${productId}/.json`)).data
        },
        async editProdcut(productId,product) {
            return (await axios.put(`https://dailymart-5c550-default-rtdb.firebaseio.com/products/${productId}/.json`,product)).data
        },
        async addProdcut(product) {
            return (await axios.post(`https://dailymart-5c550-default-rtdb.firebaseio.com/products/.json`,product)).data
        }

    },
}