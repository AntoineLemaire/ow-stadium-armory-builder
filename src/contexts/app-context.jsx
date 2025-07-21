// src/contexts/app-providers.js
import { HeroProvider } from "./hero-context";
import { BuildProvider } from "./build-context";
import { UIProvider } from "./ui-context";
import { DbProvider } from "./db-context";
import { StatsProvider } from "./stats-context";
import { AuthProvider } from "./auth-context.js";

const AppProviders = ({ children }) => {
  return (
    <DbProvider>
      <AuthProvider>
        <HeroProvider>
          <BuildProvider>
            <StatsProvider>
              <UIProvider>{children}</UIProvider>
            </StatsProvider>
          </BuildProvider>
        </HeroProvider>
      </AuthProvider>
    </DbProvider>
  );
};

export default AppProviders;
