const loading = document.querySelector('#SplashLoading');
const app = document.querySelector('#App');

/**
 * 这个方法 还是预留着 以防备用 后面假如有用呢......
 */
window.ShowLoading = () => {
    app.style.opacity = '0';
    loading.style.opacity = '1';
    loading.style.pointerEvents = 'all';
};

window.HideLoading = () => {
    app.style.opacity = '1';
    loading.style.opacity = '0';
    loading.style.pointerEvents = 'none';
};
