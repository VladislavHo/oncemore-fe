
//#region Imports
import { useEffect, useState, useCallback, useMemo } from "react";
import { Navigate, Route, Routes } from "react-router";

// Компоненты
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import MobileMenu from "../MobileMenu/MobileMenu";
import AdminRoute from "../AdminRoute/AdminRoute";
import CookieComponent from "../Cookies/Cookies";

// Страницы
import Banners from "../Pages/Banners/Banners";
import Product from "../Pages/Product/Product";
import Catalogue from "../Pages/Catalogue/Catalogue";
import VideoPlayer from "../Pages/VideoPlayer/VideoPlayer";
import Cart from "../Pages/Cart/Cart";
import Gallery from "../Pages/Gallery/Gallery";
import Liked from "../Pages/Liked/Liked";
import Profile from "../Pages/Profile/Profile";
import Admin from "../Pages/Admin/Admin";
import Logout from "../Pages/Logout/Logout";
import Orders from "../Pages/Orders/Orders";
import Checkout from "../Pages/Checkout/Checkout";

// Документы
import Confidential from "../Pages/Documents/Confidential";
import PersonalData from "../Pages/Documents/PersonalData";
import Contract from "../Pages/Documents/Contract";

// Модальные окна
import LoginModal from "../Modals/LoginModal/LoginModal";
import RegisterModal from "../Modals/RegisterModal/RegisterModal";
import VideoModal from "../Modals/VideoModal/VideoModal";
import UserModal from "../Modals/UserModal/UserModal";
import ShareModal from "../Modals/ShareModal/ShareModal";

// Модальные окна для продуктов
import NewProductModal from "../Modals/Product Modals/NewProductModal";
import EditProductModal from "../Modals/Product Modals/EditProductModal";
import DeleteProductModal from "../Modals/Product Modals/DeleteProductModal";
import ProductPhotoModal from "../Modals/Product Modals/ProductPhotoModal";
import ProductStockModal from "../Modals/Product Modals/ProductStockModal";
import DiscountModal from "../Modals/Product Modals/DiscountModal";

// Модальные окна для категорий и баннеров
import CategoryModal from "../Modals/Category Modals/CategoryModal";
import CategoryDeleteModal from "../Modals/Category Modals/CategoryDeleteModal";
import BannerDeleteModal from "../Modals/Banner Modals/BannerDeleteModal";
import BannerModal from "../Modals/Banner Modals/BannerModal";

// Утилиты и константы
import { contacts, userLinks, baseUrl } from "../../utils/constants";
import api from "../../utils/api";
import { getToken, removeToken, setToken } from "../../utils/token";

// Контексты
import { CartContext } from "../../contexts/CartContext";
import { UserContext } from "../../contexts/UserContext";

// Стили
import "./App.css";
//#endregion

export default function App() {
  //#region Состояние
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
  //#endregion

  //#region Методы для модальных окон
  const handleModalClose = useCallback((modalId) => {
    setModalsActivity((prev) => ({ ...prev, [modalId]: false }));
  }, []);

  const handleModalOpen = useCallback((modalId) => {
    setModalsActivity((prev) => ({ ...prev, [modalId]: true }));
  }, []);

  const openAnotherModal = useCallback((modalId, newModalId) => {
    setModalsActivity((prev) => ({
      ...prev,
      [modalId]: false,
      [newModalId]: true,
    }));
  }, []);
  //#endregion

  //#region Методы для продуктов и корзины
  const getProduct = useCallback((id) => {
    const product = products.find((product) => product._id == id);
    return product ? product : {};
  }, [products]);

  const getProducts = useCallback(async () => {
    return api.getProducts();
  }, []);

  const addItem = useCallback((id) => {
    const item = products.find((pr) => pr._id == id);
    if (!item) return;

    const index = cart.findIndex((cartItem) => cartItem._id == item._id);
    const newCartAmounts = [...cartAmounts];

    if (index !== -1) {
      newCartAmounts[index]++;
      setCartAmounts(newCartAmounts);
      localStorage.setItem("cartAmounts", JSON.stringify(newCartAmounts));
    } else {
      const newCart = [...cart, item];
      const newAmounts = [...cartAmounts, 1];

      setCart(newCart);
      setCartAmounts(newAmounts);

      localStorage.setItem("cart", JSON.stringify(newCart));
      localStorage.setItem("cartAmounts", JSON.stringify(newAmounts));
    }

    setCartItemsNum((prev) => prev + 1);
  }, [products, cart, cartAmounts]);

  const clearCart = useCallback(() => {
    setCart([]);
    setCartAmounts([]);
    setCartItemsNum(0);
    localStorage.removeItem("cart");
    localStorage.removeItem("cartAmounts");
  }, []);

  const likeItem = useCallback((e, id) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isLoggedIn || !user) {
      handleModalOpen("login");
      return;
    }

    const updatedProducts = [...products];
    const itemIndex = updatedProducts.findIndex((item) => item._id == id);

    if (itemIndex === -1) return;

    const item = updatedProducts[itemIndex];

    if (item.likes.includes(user.id)) {
      item.likes = item.likes.filter(likeId => likeId !== user.id);
      api.unlikeProduct(id);
    } else {
      item.likes.push(user.id);
      api.likeProduct(id);
    }

    setProducts(updatedProducts);
  }, [isLoggedIn, user, products, handleModalOpen]);

  const addProduct = useCallback(async (photo, productData) => {
    try {
      const formData = new FormData();
      formData.append("file", photo);

      const res = await api.uploadImage(formData);
      const imagePath = res.data.path;

      productData.photo = `${baseUrl}/${imagePath}`;
      return await api.addProduct(productData);
    } catch (err) {

      throw err;
    }
  }, []);

  const editProduct = useCallback(async (id, productData) => {
    try {
      return await api.editProduct(id, productData);
    } catch (err) {

      throw err;
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      return await api.deleteProduct(id);
    } catch (err) {

      throw err;
    }
  }, []);

  const addProductPhoto = useCallback(async (id, photo) => {
    try {
      const formData = new FormData();
      formData.append("file", photo);

      const res = await api.uploadImage(formData);
      const imagePath = res.data.path;
      const imageUrl = `${baseUrl}/${imagePath}`;

      return await api.addProductPhoto(id, { photo: imageUrl });
    } catch (err) {

      throw err;
    }
  }, []);

  const addProductStock = useCallback(async (id, stock) => {
    try {
      return await api.editProduct(id, { stock });
    } catch (err) {

      throw err;
    }
  }, []);

  const editDiscount = useCallback(async (id, discount) => {
    try {
      return await api.editProduct(id, { discount });
    } catch (err) {

      throw err;
    }
  }, []);
  //#endregion

  //#region Методы для отзывов и видео
  const productVideoModal = useCallback((productData) => {
    setCurrentProduct(productData);
    handleModalOpen("video");
  }, [handleModalOpen]);

  const getVideos = useCallback(async () => {
    try {
      const res = await api.getVideos();
      return res.data;
    } catch (err) {

      return [];
    }
  }, []);

  const deleteReview = useCallback(async (reviewData) => {
    try {
      return await api.deleteReview(reviewData._id);
    } catch (err) {

      throw err;
    }
  }, []);

  const addView = useCallback(async (videoId, views, userId) => {
    try {
      await api.addView(videoId, { views });

      if ((views + 1) % 1000 === 0) {
        const addedPoints = (views + 1) === 1000 ? 100 : 10;
        const userRes = await api.getUser(userId);
        const currentPoints = userRes.data.points;

        await api.changeUserPoints(userId, { points: currentPoints + addedPoints });
      }
    } catch (err) {

    }
  }, []);

  const addReview = useCallback(async (video, product, text) => {
    try {
      // Если пользователь авторизован, используем его ID, иначе null
      const author = user && user._id ? user._id : null;
      
      // Отправляем запрос на добавление обзора
      await api.addReview({ video, product, author, text });
      
      // Можно добавить обновление списка обзоров или другие действия после успешного добавления
      console.log('Обзор успешно добавлен');
    } catch (err) {
      console.error('Ошибка при добавлении обзора:', err);
      // Здесь можно добавить обработку ошибок, например, показать уведомление пользователю
    }
  }, [user]);
  //#endregion

  //#region Методы для комментариев
  const getComments = useCallback(async (videoId) => {
    try {
      return await api.getComments(videoId);
    } catch (err) {

      return [];
    }
  }, []);

  const sendComment = useCallback(async (commentText, videoId) => {
    if (!user || !user._id) {
      handleModalOpen("login");
      return;
    }

    try {
      const userId = user._id;
      await api.addComment(commentText, userId, videoId);
    } catch (err) {

    }
  }, [user, handleModalOpen]);
  //#endregion

  //#region Методы для пользователей
  const signIn = useCallback(async (email, password) => {
    try {
      const res = await api.signIn(email, password);
      setToken(res.token);
      await auth(res.token);
    } catch (err) {
      alert(err);
      throw err;
    }
  }, []);

  const auth = useCallback(async (token) => {
    try {
      const res = await api.auth(token);
      setUser(res.data);
      setLoggedIn(true);
    } catch (err) {
   removeToken();
      setLoggedIn(false);
    }
  }, []);

  const signUp = useCallback(async (email, password, name, handle, phone) => {
    try {
      await api.createUser({ email, password, name, handle, phone });
      await signIn(email, password);
    } catch (err) {
      alert(err);
      throw err;
    }
  }, [signIn]);

  const logOut = useCallback(() => {
    // First remove token and clear user data
    removeToken();

    // Update state in specific order
    // setUser({});
    setLoggedIn(false);

    // Clear cart and other user data
    // setCart([]);
    // setCartAmounts([]);
    // setCartItemsNum(0);
    // localStorage.removeItem("cart");
    // localStorage.removeItem("cartAmounts");
  }, []);

  const checkToken = useCallback(() => {
    const token = getToken();
    if (token) {
      auth(token);
    }
  }, [auth]);

  const getUser = useCallback(async (id) => {
    try {
      return await api.getUser(id);
    } catch (err) {

      throw err;
    }
  }, []);

  const blockUser = useCallback(async (userData) => {
    try {
      return await api.editUser(userData._id, { blocked: true });
    } catch (err) {

      throw err;
    }
  }, []);

  const editUser = useCallback(async (image) => {
    try {
      const formData = new FormData();
      formData.append("file", image);

      const res = await api.uploadImage(formData);
      const avatarPath = res.data.path;
      const avatarUrl = `${baseUrl}/${avatarPath}`;

      return await api.editUser({ avatar: avatarUrl });
    } catch (err) {

      throw err;
    }
  }, []);

  const spendPoints = useCallback(async (points) => {
    if (!user || !user._id) return;

    try {
      const currentPoints = user.points;
      return await api.changeUserPoints(user._id, { points: currentPoints - points });
    } catch (err) {

      throw err;
    }
  }, [user]);
  //#endregion

  //#region Методы для категорий и баннеров
  const deleteCategory = useCallback(async (name) => {
    try {
      return await api.deleteCategory({ name });
    } catch (err) {

      throw err;
    }
  }, []);

  const createCategory = useCallback(async (name) => {
    try {
      const link = `/items?filter=${name}`;
      return await api.createCategory({ name, link });
    } catch (err) {

      throw err;
    }
  }, []);

  const getCategories = useCallback(async () => {
    try {
      const res = await api.getCategories();
      return res.data;
    } catch (err) {

      return [];
    }
  }, []);

  const deleteBanner = useCallback(async (id) => {
    try {
      return await api.deleteBanner(id);
    } catch (err) {

      throw err;
    }
  }, []);

  const createBanner = useCallback(async (title, subtitle, image, paragraphs) => {
    try {
      const formData = new FormData();
      formData.append("file", image);

      const res = await api.uploadImage(formData);
      const imagePath = res.data.path;
      const imageUrl = `${baseUrl}/${imagePath}`;

      return await api.createBanner({ title, subtitle, paragraphs, image: imageUrl });
    } catch (err) {

      throw err;
    }
  }, []);

  const getBanners = useCallback(async () => {
    try {
      const res = await api.getBanners();
      return res.data;
    } catch (err) {

      return [];
    }
  }, []);
  //#endregion

  //#region Методы для заказов
  const createOrder = useCallback(async (data) => {
    try {
      return await api.createOrder(data);
    } catch (err) {

      throw err;
    }
  }, []);

  const updateOrderStatus = useCallback(async (id, status) => {
    try {
      return await api.updateOrderStatus(id, { status });
    } catch (err) {

      throw err;
    }
  }, []);

  const getMyOrders = useCallback(async () => {
    try {
      const res = await api.getMyOrders();
      return res.data;
    } catch (err) {

      return [];
    }
  }, []);

  const getOrders = useCallback(async () => {
    try {
      const res = await api.getOrders();
      return res.data;
    } catch (err) {

      return [];
    }
  }, []);
  //#endregion

  //#region Эффекты
  // Инициализация данных при загрузке
  useEffect(() => {
    const initializeData = async () => {
      try {
        const [categoriesData, productsData, videosData, bannersData] = await Promise.all([
          getCategories(),
          getProducts(),
          getVideos(),
          getBanners()
        ]);

        setCategories(categoriesData);
        setProducts(productsData.data);
        setVideos(videosData);
        setBanners(bannersData);
      } catch (err) {

      }
    };

    initializeData();
    checkToken();

    // Загрузка корзины из localStorage
    const storageCart = localStorage.getItem("cart");
    if (storageCart) {
      setCart(JSON.parse(storageCart));
    }

    const storageCartAmounts = localStorage.getItem("cartAmounts");
    if (storageCartAmounts) {
      const amounts = JSON.parse(storageCartAmounts);
      setCartAmounts(amounts);
      setCartItemsNum(amounts.reduce((sum, i) => sum + i, 0));
    }

    // Обработчик изменения размера окна
    const handleResize = () => {
      setOnMobile(window.innerWidth < 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getCategories, getProducts, getVideos, getBanners, checkToken]);

  // Загрузка данных пользователя при изменении статуса авторизации
  useEffect(() => {
    if (!isLoggedIn) return;

    api.getCurrentUser()
      .then((res) => setUser(res.data))
      .catch((err) => {

        setLoggedIn(false);
      });
  }, [isLoggedIn]);
  //#endregion

  //#region Мемоизированные значения контекста
  const cartContextValue = useMemo(() => ({
    cart,
    addItem,
    cartAmounts
  }), [cart, addItem, cartAmounts]);

  const userContextValue = useMemo(() => ({
    user
  }), [user]);
  //#endregion

  // Memoized filtered categories
  const newProductsCategory = useMemo(() => {
    return categories && categories.length > 0
      ? categories.filter(c => c.name === "Новинки")
      : [];
  }, [categories]);

  return (
    <div className="page">
      <CartContext.Provider value={cartContextValue}>
        <UserContext.Provider value={userContextValue}>
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
                  deleteComment={() => { }}
                  sendComment={sendComment}
                  likeComment={() => { }}
                  addView={addView}
                  openShareModal={() => handleModalOpen("share")}
                />
              } />
              {/* <Route path="liked" element={
                <Liked
                  isLoggedIn={isLoggedIn}
                  openSignUp={() => handleModalOpen("signup")}
                  items={products}
                  addItem={addItem}
                />
              } /> */}
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
                  categories={newProductsCategory}
                />
              } />
              {/* <Route path='/login' element={
                <LoginModal
                  name="login"
                  onClose={handleModalClose}
                  isOpen={modalsActivity["login"]}
                  openAnotherModal={() => openAnotherModal("login", "signup")}
                  signIn={signIn}
                />
              } /> */}
            </Routes>
          </div>

          <Footer contacts={contacts} />

          <div className="modals">
            <LoginModal
              name="login"
              onClose={handleModalClose}
              isOpen={modalsActivity["login"]}
              openAnotherModal={() => openAnotherModal("login", "signup")}
              signIn={signIn}
            />
            <RegisterModal
              name="signup"
              onClose={handleModalClose}
              isOpen={modalsActivity["signup"]}
              openAnotherModal={() => openAnotherModal("signup", "login")}
              signUp={signUp}
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

          <CookieComponent />
        </UserContext.Provider>
      </CartContext.Provider>
    </div>
  );
}
