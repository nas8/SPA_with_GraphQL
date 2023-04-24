import styled from 'styled-components';

export const StyledRepoItem = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 10px;
  gap: 15px;
  box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  overflow: hidden;
`;

export const RepoName = styled.span`
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s linear;

  :hover {
    text-decoration: underline;
  }
`;

export const RepoLink = styled.a`
  max-width: 370px;
  white-space: nowrap;
`;

export const StarCounter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  width: 100px;
`;
