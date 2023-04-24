import styled, { css } from 'styled-components';

export const StyledPaginator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

export const Button = styled.button<{ isActive: boolean }>`
  cursor: pointer;

  ${({ isActive }) =>
    isActive &&
    css`
      border: 2px solid black;
    `}
`;
