import React from 'react';
import { RepoLink, RepoName, StarCounter, StyledRepoItem } from './RepoItem.styled';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Repo, setCurrentRepoName, setCurrentRepoOwner } from '../../../../store/reposSlice';
import { formatISODate } from '../../../../utils/formatISODate';
import Star from '../../../../assets/star.svg';

interface RepoItemProps {
  data: Repo;
}

export const RepoItem: React.FC<RepoItemProps> = ({ data }) => {
  const { name, stargazerCount, pushedAt, url, owner } = data;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (e: any) => {
    const repoName = e.target.getAttribute('data-name');
    const repoOwner = e.target.getAttribute('data-owner');

    dispatch(setCurrentRepoName(repoName));
    dispatch(setCurrentRepoOwner(repoOwner));

    navigate('repo');
  };

  return (
    <StyledRepoItem>
      <RepoName onClick={handleClick} data-name={name} data-owner={owner.login}>
        {name}
      </RepoName>
      <StarCounter>
        <img style={{ width: '15px' }} src={Star} alt="" />
        {stargazerCount}
      </StarCounter>
      <span>{formatISODate(pushedAt)}</span>
      <RepoLink href={url} target="blank">
        {url}
      </RepoLink>
    </StyledRepoItem>
  );
};
