import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styled from "styled-components";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

const StyledMain = styled.main`
  padding: 4rem 4.8rem 6.4rem;
  background-color: var(--color-grey-50);
  overflow: scroll;
`;

const Contianer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  gap: 3.2rem;
  max-width: 120rem;
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Header />
      <Sidebar />
      <StyledMain>
        <Contianer>
          <Outlet />
        </Contianer>
      </StyledMain>
    </StyledAppLayout>
  );
}

export default AppLayout;
