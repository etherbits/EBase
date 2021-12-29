import SearchIcon from 'public/icons/search.svg'
import styles from './styles.module.scss'

interface Props {
	Search: (query: string) => void
}

const Search: React.FunctionComponent<Props> = ({ Search }) => {
	return (
		<div className={styles.search}>
			<SearchIcon/>
			<input placeholder='Search' onKeyUp={(e)=>{Search(e.currentTarget.value)}} type={'text'} />
		</div>
	)
}

export default Search
