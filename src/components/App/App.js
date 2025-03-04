//#region Imports

import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import "./App.css";
import { contacts, userLinks, baseUrl } from "../../utils/constants";
import { Navigate, Route, Routes, json } from "react-router";
import { useEffect, useRef, useState } from "react";
import LoginModal from "../Modals/LoginModal/LoginModal";
import RegisterModal from "../Modals/RegisterModal/RegisterModal";
import MobileMenu from "../MobileMenu/MobileMenu";
import Banners from "../Pages/Banners/Banners";
import Product from "../Pages/Product/Product";
import Catalogue from "../Pages/Catalogue/Catalogue";
import api from "../../utils/api";
import VideoPlayer from "../Pages/VideoPlayer/VideoPlayer";

import { CartContext } from "../../contexts/CartContext";
import { UserContext } from "../../contexts/UserContext";
import Cart from "../Pages/Cart/Cart";
import Gallery from "../Pages/Gallery/Gallery";
import Liked from "../Pages/Liked/Liked";
import Profile from "../Pages/Profile/Profile";
import VideoModal from "../Modals/VideoModal/VideoModal";
import UserModal from "../Modals/UserModal/UserModal";
import Admin from "../Pages/Admin/Admin";
import NewProductModal from "../Modals/Product Modals/NewProductModal";
import AdminRoute from "../AdminRoute/AdminRoute";
import { getToken, removeToken, setToken } from "../../utils/token";
import Logout from "../Pages/Logout/Logout";
import CategoryModal from "../Modals/Category Modals/CategoryModal";
import CategoryDeleteModal from "../Modals/Category Modals/CategoryDeleteModal";
import BannerDeleteModal from "../Modals/Banner Modals/BannerDeleteModal";
import BannerModal from "../Modals/Banner Modals/BannerModal";
import Orders from "../Pages/Orders/Orders";
import ShareModal from "../Modals/ShareModal/ShareModal";
import Confidential from "../Pages/Documents/Confidential";
import PersonalData from "../Pages/Documents/PersonalData";
import EditProductModal from "../Modals/Product Modals/EditProductModal";
import DeleteProductModal from "../Modals/Product Modals/DeleteProductModal";
import ProductPhotoModal from "../Modals/Product Modals/ProductPhotoModal";
import Contract from "../Pages/Documents/Contract";
import ProductStockModal from "../Modals/Product Modals/ProductStockModal";
import DiscountModal from "../Modals/Product Modals/DiscountModal";
import Checkout from "../Pages/Checkout/Checkout";
import CookieComponent from "../Cookies/Cookies";


//#endregion

export default function App(props) {
  //#region Methods

  //#region Modals

  function handleModalClose(modalId) {
    setModalsActivity({ ...modalsActivity, [modalId]: false });
  }

  function handleModalOpen(modalId) {
    setModalsActivity({ ...modalsActivity, [modalId]: true });
  }

  function openAnotherModal(modalId, newModalId) {
    setModalsActivity({
      ...modalsActivity,
      [modalId]: false,
      [newModalId]: true,
    });
  }

  //#endregion

  //#region Products & Cart

  function getProduct(id) {
    const product = products.find((product) => product._id == id);
    return product ? product : {};
  }

  async function getProducts() {
    return api.getProducts();
  }

  function addItem(id) {
    const item = products.find((pr) => pr._id == id);
    const index = cart.findIndex((cartItem) => cartItem._id == item._id)
    if (index != -1) {
      cartAmounts[index]++;
      localStorage.setItem("cartAmounts", JSON.stringify(cartAmounts));
    } else {
      localStorage.setItem("cartAmounts", JSON.stringify([...cartAmounts, 1]));
      localStorage.setItem("cart", JSON.stringify([...cart, item]));
      setCart([...cart, item]);
      cartAmounts.push(1);
    }
    setCartItemsNum(cartItemsNum + 1);
  }

  function clearCart() {
    setCart([]);
    localStorage.clear("cart")
  }

  function likeItem(e, id) {
    e.stopPropagation();
    e.preventDefault();

    if (!isLoggedIn || !user) {
      handleModalOpen("login");
      return;
    }

    const item = products.find((item) => item._id == id);
    if (item.likes.includes(user.id)) {
      item.likes.pop(user.id);
      api.unlikeProduct(id);
    }
    else {
      item.likes.push(user.id);
      api.likeProduct(id);
    }
  }

  async function addProduct(photo, productData) {
    const formData = new FormData();
    formData.append("file", photo);

    return api.uploadImage(formData)
      .then((res) => res.data.path)
      .then((image) => {
        productData.photo = baseUrl + "/" + image;
        return api.addProduct(productData);
      })
      .catch((err) => console.log(err));
  }

  async function editProduct(id, productData) {
    api.editProduct(id, productData);
  }

  async function deleteProduct(id) {
    api.deleteProduct(id);
  }

  async function addProductPhoto(id, photo) {
    const formData = new FormData();
    formData.append("file", photo);

    return api.uploadImage(formData)
      .then((res) => res.data.path)
      .then((image) => {
        image = baseUrl + "/" + image;
        return api.addProductPhoto(id, { photo: image })
      })
      .catch((err) => console.log(err));
  }

  async function addProductStock(id, stock) {
    return api.editProduct(id, { stock });
  }

  async function editDiscount(id, discount) {
    return api.editProduct(id, { discount });
  }

  //#endregion

  //#region Reviews

  function productVideoModal(productData) {
    setCurrentProduct(productData);
    handleModalOpen("video");
  }

  async function getVideos() {
    return api.getVideos()
      .then((res) => res.data);
  }

  function deleteReview(reviewData) {
    return api.deleteReview(reviewData._id);
  }

  function addView(videoId, views, userId) {
    api.addView(videoId, { views });

    if ((views + 1) % 1000 == 0) {
      const addedPoints = (views + 1) == 1000 ? 100 : 10;
      api.getUser(userId)
        .then((res) => res.data.points)
        .then((points) => api.changeUserPoints(
          userId, { points: points + addedPoints }))
        .catch((err) => console.log(err));
    }
  }

  async function addReview(video, product, text) {
    const author = user._id;
    console.log({ video, product, author, text }, 'ADD REVIEWS')
    api.addReview({ video, product, author, text });
  }

  //#endregion

  //#region Comments

  function deleteComment(commentData) {

  }

  async function getComments(videoId) {
    return api.getComments(videoId);
  }

  function sendComment(commentText, videoId) {
    const userId = user._id;
    api.addComment(commentText, userId, videoId)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  function likeComment(commentId) {

  }

  //#endregion

  //#region User

  async function signIn(email, password) {
    return api
      .signIn(email, password)
      .then((res) => {
        setToken(res.token);
        auth(res.token);
      })
      .catch((err) => alert(err));
  }

  async function auth(token) {
    return api
      .auth(token)
      .then((res) => {
        setUser(res.data);
        setLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function signUp(email, password, name, handle, phone) {
    return api.createUser({ email, password, name, handle, phone })
      .then(() => signIn(email, password))
      .catch((err) => alert(err));
  }

  function logOut() {
    removeToken();
    setLoggedIn(false);
  }

  function checkToken() {
    const token = getToken();
    if (token) {
      auth(token);
    }
  }

  function getUser(id) {
    return api.getUser(id);
  }

  async function blockUser(userData) {
    return api.editUser(userData._id, { blocked: true });
  }

  async function editUser(image) {
    const formData = new FormData();
    formData.append("file", image);

    return api.uploadImage(formData)
      .then((res) => res.data.path)
      .then((avatar) => {
        avatar = baseUrl + "/" + avatar;
        return api.editUser({ avatar });
      })
      .then((data) => console.log(data));
  }

  async function spendPoints(points) {
    if (!user) return;

    const currentPoints = user.points;
    return api.changeUserPoints(user._id, { points: currentPoints - points });
  }

  //#endregion

  //#region Categories & Banners

  async function deleteCategory(name) {
    return api.deleteCategory({ name });
  }

  async function createCategory(name) {
    const link = `/items?filter=${name}`;
    return api.createCategory({ name, link });
  }

  async function getCategories() {
    return api.getCategories()
      .then((res) => res.data);
  }

  async function deleteBanner(id) {
    return api.deleteBanner(id);
  }

  async function createBanner(title, subtitle, image, paragraphs) {
    const formData = new FormData();
    formData.append("file", image);

    return api.uploadImage(formData)
      .then((res) => res.data.path)
      .then((image) => {
        image = baseUrl + "/" + image;
        return api.createBanner({ title, subtitle, paragraphs, image });
      })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }

  async function getBanners() {
    return api.getBanners()
      .then((res) => res.data);
  }

  //#endregion

  //#region Orders

  function createOrder(data) {
    api.createOrder(data);
  }

  function updateOrderStatus(id, status) {
    return api.updateOrderStatus(id, { status });
  }

  async function getMyOrders() {
    return api.getMyOrders()
      .then((res) => res.data);
  }

  async function getOrders() {
    return api.getOrders()
      .then((res) => res.data);
  }

  //#endregion

  //#endregion


  //#region Variables Setup

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [modalsActivity, setModalsActivity] = useState({
    signup: false,
    login: false,
    video: false,
    user: false,
    newproduct: false,
    editproduct: false,
    category: false,
    categorydelete: false,
    bannerdelete: false,
    banner: false,
    share: false,
    deleteproduct: false,
    productphoto: false,
    productstock: false,
    discount: false,
  });
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isOnMobile, setOnMobile] = useState(window.innerWidth < 600);
  const [videos, setVideos] = useState([]);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartAmounts, setCartAmounts] = useState([]);
  const [user, setUser] = useState({});
  const [currentProduct, setCurrentProduct] = useState("");
  const [cartItemsNum, setCartItemsNum] = useState(0);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res));
    getProducts()
      .then((res) => setProducts(res.data));
    getVideos()
      .then((res) => setVideos(res));
    getBanners()
      .then((res) => setBanners(res));
    checkToken();

    const storageCart = localStorage.getItem("cart");
    if (storageCart)
      setCart(JSON.parse(storageCart));
    const storageCartAmounts = localStorage.getItem("cartAmounts");
    if (storageCartAmounts) {
      setCartAmounts(JSON.parse(storageCartAmounts));
      setCartItemsNum(JSON.parse(storageCartAmounts)
        .reduce((i, sum) => sum + i, 0));
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    api.getCurrentUser()
      .then((res) => setUser(res.data))
      .catch(() => setLoggedIn(false));
  }, [isLoggedIn]);



  //#endregion

  //#region Rendering
  return (
    <div className="page">
      <CartContext.Provider value={{ cart, addItem, cartAmounts }}>
        <UserContext.Provider value={{ user }}>
          <Header
            categories={categories}
            userLinks={userLinks}
            isLoggedIn={isLoggedIn}
            handleModalOpen={handleModalOpen}
            isOnMobile={isOnMobile}
            setMenuOpen={setMenuOpen}
            cartItemsNum={cartItemsNum}
          />
          <div className="page__main">
            <Routes>
              <Route path="item" element={
                <Product
                  videos={videos}
                  items={products}
                  addItem={addItem}
                  likeItem={likeItem}
                  openLoginModal={() => handleModalOpen("login")}
                  isLoggedIn={isLoggedIn}
                  openVideoModal={(data) => productVideoModal(data)}
                />
              } />
              <Route path="items/gallery" element={
                <Gallery
                  items={products}
                  videos={videos}
                  likeItem={likeItem}
                  addItem={addItem}
                  openLoginModal={() => handleModalOpen("login")}
                  isLoggedIn={isLoggedIn}
                  getProduct={getProduct}
                />
              } />
              <Route path="items" element={
                <Catalogue
                  items={products}
                  videos={videos}
                  addItem={addItem}
                  likeItem={likeItem}
                  openLoginModal={() => handleModalOpen("login")}
                  isLoggedIn={isLoggedIn}
                  getProduct={getProduct}
                />
              } />
              <Route path="review" element={
                <VideoPlayer
                  videos={videos}
                  items={products}
                  getUser={getUser}
                  getProduct={getProduct}
                  deleteReview={deleteReview}
                  blockUser={blockUser}
                  getComments={getComments}
                  deleteComment={deleteComment}
                  sendComment={sendComment}
                  likeComment={likeComment}
                  addView={addView}
                  openShareModal={() => handleModalOpen("share")}
                />
              } />
              <Route path="liked" element={
                <Liked
                  isLoggedIn={isLoggedIn}
                  openSignUp={() => handleModalOpen("signup")}
                  items={products}
                  addItem={addItem}
                />
              } />
              <Route path="cart" element={
                <Cart
                  clearCart={clearCart}
                  likeItem={likeItem}
                  createOrder={createOrder}
                />
              } />
              <Route path="user" element={
                <Profile
                  loadOrders={getMyOrders}
                  getUser={getUser}
                  videos={videos}
                  getProduct={getProduct}
                  isOnMobile={isOnMobile}
                  openVideoModal={() => handleModalOpen("video")}
                  openUserModal={() => handleModalOpen("user")}
                />
              } />
              <Route path="me" element={
                <Navigate to={`/user?id=${user._id}`} />
              } />
              <Route path="checkout" element={
                <Checkout
                  onSubmit={createOrder}
                  spendPoints={spendPoints}
                />
              } />
              <Route path="admin" element={
                <AdminRoute>
                  <Admin
                    getOrders={getOrders}
                    getProduct={getProduct}
                    updateOrderStatus={updateOrderStatus}
                    openProductModal={() => handleModalOpen("newproduct")}
                    openCategoryModal={() => handleModalOpen("category")}
                    openDeleteCategoryModal={() => handleModalOpen("categorydelete")}
                    openBannerModal={() => handleModalOpen("banner")}
                    openDeleteBannerModal={() => handleModalOpen("bannerdelete")}
                    openEditProductModal={() => handleModalOpen("editproduct")}
                    openProductPhotoModal={() => handleModalOpen("productphoto")}
                    openProductStockModal={() => handleModalOpen("productstock")}
                    openDiscountModal={() => handleModalOpen("discount")}
                  />
                </AdminRoute>
              } />
              <Route path="logout" element={
                <Logout logOut={logOut} />
              } />
              <Route path="orders" element={
                <Orders
                  loadOrders={getMyOrders}
                />
              } />
              <Route path="confidentiality" element={
                <Confidential />
              } />
              <Route path="personal-data" element={
                <PersonalData />
              } />
              <Route path="contract" element={
                <Contract />
              } />
              <Route path="/" element={
                <Banners
                  banners={banners}
                />
              } />
            </Routes>
          </div>
          <Footer
            contacts={contacts}
          />

          <div className="modals">
            <RegisterModal
              name="signup"
              onClose={handleModalClose}
              isOpen={modalsActivity["signup"]}
              openAnotherModal={() => openAnotherModal("signup", "login")}
              signUp={signUp}
            />
            <LoginModal
              name="login"
              onClose={handleModalClose}
              isOpen={modalsActivity["login"]}
              openAnotherModal={() => openAnotherModal("login", "signup")}
              signIn={signIn}
            />
            <VideoModal
              name="video"
              loadOrders={getMyOrders}
              onClose={handleModalClose}
              isOpen={modalsActivity["video"]}
              product={currentProduct}
              loadVideo={addReview}
            />
            <UserModal
              name="user"
              onClose={handleModalClose}
              isOpen={modalsActivity["user"]}
              onSubmit={editUser}
            />

            <NewProductModal
              name="newproduct"
              onClose={handleModalClose}
              isOpen={modalsActivity["newproduct"]}
              addProduct={addProduct}
            />
            <EditProductModal
              name="editproduct"
              onClose={handleModalClose}
              isOpen={modalsActivity["editproduct"]}
              editProduct={editProduct}
            />
            <DeleteProductModal
              name="deleteproduct"
              onClose={handleModalClose}
              isOpen={modalsActivity["deleteproduct"]}
              onSubmit={deleteProduct}
            />
            <ProductPhotoModal
              name="productphoto"
              onClose={handleModalClose}
              isOpen={modalsActivity["productphoto"]}
              onSubmit={addProductPhoto}
            />
            <ProductStockModal
              name="productstock"
              onClose={handleModalClose}
              isOpen={modalsActivity["productstock"]}
              onSubmit={addProductStock}
            />
            <DiscountModal
              name="discount"
              onClose={handleModalClose}
              isOpen={modalsActivity["discount"]}
              onSubmit={editDiscount}
            />


            <CategoryModal
              name="category"
              onClose={handleModalClose}
              isOpen={modalsActivity["category"]}
              addProduct={addProduct}
              onSubmit={createCategory}
            />
            <CategoryDeleteModal
              name="categorydelete"
              onClose={handleModalClose}
              isOpen={modalsActivity["categorydelete"]}
              addProduct={addProduct}
              onSubmit={deleteCategory}
            />
            <BannerDeleteModal
              name="bannerdelete"
              onClose={handleModalClose}
              isOpen={modalsActivity["bannerdelete"]}
              onSubmit={deleteBanner}
            />
            <BannerModal
              name="banner"
              onClose={handleModalClose}
              isOpen={modalsActivity["banner"]}
              onSubmit={createBanner}
            />
            <ShareModal
              name="share"
              onClose={handleModalClose}
              isOpen={modalsActivity["share"]}
            />

          </div>
          <MobileMenu
            isMenuOpen={isMenuOpen}
            setMenuOpen={setMenuOpen}
            openLoginModal={() => handleModalOpen("login")}
            categories={categories}
            isLoggedIn={isLoggedIn}
            userLinks={userLinks}
          />
          {
            <CookieComponent />
          }
        </UserContext.Provider>
      </CartContext.Provider>
    </div>
  );

  //#endregion
}