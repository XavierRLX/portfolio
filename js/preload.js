const preCarregamento = document.getElementById("preloadid");

document.addEventListener("DOMContentLoaded", () => {
    requestAnimationFrame(() => preCarregamento?.classList.add("preload--hidden"));
});
