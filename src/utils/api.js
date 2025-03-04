import defaultVid from "../temp/video.mp4";
import {baseUrl} from "./constants";

class Api {
  constructor() {
    this._baseUrl = baseUrl;
    this._headers = new Headers({
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
  }

  async _request(url, method, requestBody, headers = this._headers) {
    return fetch(this._baseUrl + url, {
      method: method,
      headers: headers,
      body: JSON.stringify(requestBody),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        console.log(res);
        return Promise.reject(this._processError(res));
      }
    });
  }
  
  async uploadImage(data) {
    console.log(data);
    this._headers.delete("Content-type");

    return fetch(this._baseUrl + "/upload", {
      method: "POST",
      headers: this._headers,
      body: data,
    }).then((res) => {
      this._headers.set("content-type", "application/json");
      if (res.ok) {
        return res.json();
      } else {
        console.log(res);
        return Promise.reject(this._processError(res));
      }
    })
  }

  _processError(res) {
    if (res.status == 409)
      return "Пользователь с таким email или handle уже существует";
    if (res.status == 401)
      return "Авторизация не удалась: проверьте данные";
  }

  //#region Reviews & Comments

  async getVideos() {
    return this._request("/reviews", "GET");
  }

  async addReview(data) {
    return this._request("/reviews", "POST", data);
  }

  async addComment(text, author, review) {
    return this._request(`/comments`, "POST", {text, author, review});     
  }

  async getComments(videoId)
  {
    return this._request(`/comments/${videoId}`, "GET");
  }

  async addView(videoId, data)
  {
    return this._request(`/reviews/${videoId}`, "PATCH", data);
  }

  async deleteReview(id)
  {
    return this._request(`/reviews/${id}`, "DELETE");
  }

  //#endregion

  //#region Product

  async addProduct(productData) {
    return this._request("/products", "POST", productData);
  }

  async getProducts() {
    return this._request("/products", "GET");
  }

  async editProduct(id, data) {
    return this._request(`/products/${id}`, "PATCH", data);
  }

  async addProductPhoto(id, data) {
    return this._request(`/products/${id}`, "POST", data);
  }

  async deleteProduct(id) {
    return this._request(`/products/${id}`, "DELETE");
  }

  async likeProduct(id) {
    return this._request(`/products/${id}/like`, "PATCH");
  }

  async unlikeProduct(id) {
    return this._request(`/products/${id}/unlike`, "PATCH");
  }

  //#endregion

  //#region User

  async signIn(email, password) {
    return this._request(`/signin`, "POST", {email, password}); 
  }

  async auth(token) {
    this.setTokenHeader(token);
    return this._request("/users/me", "GET");
  }

  setTokenHeader(token) {
    this._headers = new Headers({
      "content-Type": "application/json",
      authorization: `Bearer ${token}`,
    });
  }

  async createUser(data) {
    return this._request(`/signup`, "POST", data); 
  }

  async editUser(data) {
    return this._request("/users/me", "PATCH", data);
  }

  async getUser(id) {
    return this._request(`/users/${id}`, "GET");    
  }

  async getCurrentUser() {
    return this._request(`/users/me`, "GET"); 
  }

  async changeUserPoints(id, data) {
    return this._request(`/users/points/${id}`, "PATCH", data); 
  }


  //#endregion

  //#region Categories & Banners

  async createCategory(data) {
    return this._request(`/categories`, "POST", data); 
  }

  async deleteCategory(data) {
    return this._request(`/categories`, "DELETE", data); 
  }

  async getCategories() {
    return this._request(`/categories`, "GET"); 
  }

  async getBanners() {
    return this._request(`/banners`, "GET"); 
  }

  async createBanner(data) {
    console.log(data);
    return this._request(`/banners`, "POST", data); 
  }

  async deleteBanner(id) {
    return this._request(`/banners/${id}`, "DELETE"); 
  }

  //#endregion

  //#region Orders

  async createOrder(data) {
    console.log(data);
    return this._request("/orders", "POST", data);
  }

  async getOrders() {
    return this._request("/orders", "GET");
  }

  async getMyOrders() {
    return this._request("/orders/my", "GET");
  }

  async updateOrderStatus(id, data) {
    return this._request(`/orders/${id}`, "PATCH", data);
  }

  //#endregion
}

export default new Api();