import styled from 'styled-components';

export const ReposListStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  padding: 5px;
  width: 100%;
`;

export const ReposListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

export const SearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  width: 850px;
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 10px;
  font-size: 20px;
  padding: 0px 5px;
`;

export const SearchButton = styled.button`
  height: 40px;
  width: 100px;
  border-radius: 10px;
  cursor: pointer;
`;
