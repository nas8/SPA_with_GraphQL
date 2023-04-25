import { useNavigate } from 'react-router-dom';
import { useGetRepoQuery } from '../../api/queryRepo';
import { LastItemWrapper, RepoCard } from './RepoPage.styled';
import { formatISODate } from '../../utils/formatISODate';

export const RepoPage = () => {
  const { isError, isLoading, isSuccess, data } = useGetRepoQuery({
    owner: localStorage.getItem('currentRepoOwner'),
    name: localStorage.getItem('currentRepoName'),
  });
  const languages = data?.languages.map((lang: any) => lang.node.name);
  const strLanguages = languages?.join(', ');
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <>
      {isError && <div>Loading error</div>}
      {isLoading && <h3>Loading...</h3>}
      {isSuccess && (
        <div>
          <RepoCard>
            <h2>{data?.name}</h2>
            <div>
              <p>owner: {data?.owner.login}</p>
              <p>
                link:{' '}
                <a href={data.owner.url} target="blank">
                  {data.owner.url}
                </a>
              </p>
              <img style={{ width: '50px', height: '50px' }} src={data?.owner.avatarUrl} alt="" />
            </div>
            <p>Description: {!data.description ? 'No description' : data.description}</p>
            <p>Stars: {data?.stargazerCount}</p>
            <p>Languages: {strLanguages}</p>
            <LastItemWrapper>
              <p style={{ marginBottom: 0 }}>Last commit: {formatISODate(data.pushedAt)}</p>
              <button style={{ width: '100px', alignSelf: 'flex-end' }} onClick={handleClick}>
                Back
              </button>
            </LastItemWrapper>
          </RepoCard>
        </div>
      )}
    </>
  );
};
