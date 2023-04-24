import { StyledLayout } from './Layout.styled';

interface LayoutProps {
  children: JSX.Element;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <StyledLayout>{children}</StyledLayout>;
};
