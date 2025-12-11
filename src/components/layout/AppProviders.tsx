import { BrowserRouter } from "react-router-dom";
import { DiscountedProductProvider } from "../../contexts/Product/ProductsManagement";
import { MobileMenuProvider } from "../../contexts/MobileMenuContext";
import { IAProvider } from "../../contexts/IA";
import { AutoLogoutWrapper } from "../wrappers/AutoLogoutWrapper";

interface AppProvidersProps {
    children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <BrowserRouter>
            <IAProvider>
                <MobileMenuProvider>
                    <DiscountedProductProvider>
                        <AutoLogoutWrapper>
                            {children}
                        </AutoLogoutWrapper>
                    </DiscountedProductProvider>
                </MobileMenuProvider>
            </IAProvider>
        </BrowserRouter>
    );
}
