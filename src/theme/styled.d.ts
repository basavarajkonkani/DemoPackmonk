import 'styled-components/native';
import { ThemeType } from './index';

declare module 'styled-components/native' {
  export interface DefaultTheme extends ThemeType {}
}
