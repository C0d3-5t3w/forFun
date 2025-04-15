export function initMenu() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item) => {
        const dropdown = item.querySelector('.dropdown');
        if (dropdown) {
            item.addEventListener('mouseenter', () => {
                dropdown.classList.add('visible');
            });
            item.addEventListener('mouseleave', () => {
                dropdown.classList.remove('visible');
            });
        }
    });
    console.log('Dropdown menu initialized');
}
