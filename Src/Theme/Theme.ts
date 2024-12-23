import { Manager } from '../Libs/Manager';

class Theme extends Manager {
    private styles = {
        Dark: () => import('./Style/Dark.scss'),
        Light: () => import('./Style/Light.scss')
    };

    public LoadTheme(theme: keyof typeof this.styles) {
        this.styles[theme]();
        document.getElementById('App')!.className = theme;
    }
}

const ThemeInstance = new Theme();

export { ThemeInstance as Theme };
