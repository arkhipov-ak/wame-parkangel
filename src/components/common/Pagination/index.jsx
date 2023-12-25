import PaginationPage from "rc-pagination"
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import styles from "./Pagination.module.css";
import { state } from "src/state";

export default function Pagination({ total, page, slug }) {
	const snap = useSnapshot(state);
	const navigate = useNavigate();

	const onHandleChange = (itemPage) => {
		if (itemPage !== page) navigate(`${slug}?page=${itemPage}`);
	};

	return (
		total > 1 && (
			<div className={styles.pagination}>
				<PaginationPage
					defaultCurrent={+page}
					total={total}
					defaultPageSize={1}
					pageSize={1}
					current={+page}
					locale="en_En"
					showSizeChanger={false}
					onChange={onHandleChange}
					prevIcon={
						<>
							<button
								className="prev"
								disabled={+page === 1}
							>
								<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M7.29289 0.429124C7.68342 0.0385994 8.31658 0.0385994 8.70711 0.429124C9.09763 0.819648 9.09763 1.45281 8.70711 1.84334L3.41421 7.13623H15C15.5523 7.13623 16 7.58395 16 8.13623C16 8.68852 15.5523 9.13623 15 9.13623H3.41421L8.70711 14.4291C9.09763 14.8196 9.09763 15.4528 8.70711 15.8433C8.31658 16.2339 7.68342 16.2339 7.29289 15.8433L0.293607 8.84405C0.29119 8.84164 0.288787 8.83922 0.286395 8.83678C0.109902 8.65702 0.000801086 8.41086 3.8147e-06 8.13923C9.53674e-07 8.13823 0 8.13723 0 8.13623C0 8.13523 9.53674e-07 8.13423 3.8147e-06 8.13323C0.000398636 7.99873 0.0273466 7.87048 0.0758791 7.75345C0.12357 7.63818 0.193742 7.53003 0.286395 7.43568C0.288754 7.43328 0.291124 7.43089 0.293507 7.42851M7.29289 0.429124L0.293507 7.42851Z"
										fill={snap.user?.theme === "dark" ? "#fff" : "#262931"}
									/>
								</svg>
							</button>
						</>
					}
					nextIcon={
						<>
							<button
								className="next"
								disabled={+total === +page}>
								<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M9.06062 0.429124C8.6701 0.0385994 8.03693 0.0385994 7.64641 0.429124C7.25588 0.819648 7.25588 1.45281 7.64641 1.84334L12.9393 7.13623H1.35352C0.801231 7.13623 0.353516 7.58395 0.353516 8.13623C0.353516 8.68852 0.801231 9.13623 1.35352 9.13623H12.9393L7.64641 14.4291C7.25588 14.8196 7.25588 15.4528 7.64641 15.8433C8.03693 16.2339 8.6701 16.2339 9.06062 15.8433L16.0599 8.84405C16.0623 8.84164 16.0647 8.83922 16.0671 8.83678C16.2436 8.65702 16.3527 8.41086 16.3535 8.13923C16.3535 8.13823 16.3535 8.13723 16.3535 8.13623C16.3535 8.13523 16.3535 8.13423 16.3535 8.13323C16.3531 7.99873 16.3262 7.87048 16.2776 7.75345C16.2299 7.63818 16.1598 7.53003 16.0671 7.43568C16.0648 7.43328 16.0624 7.43089 16.06 7.42851M9.06062 0.429124L16.06 7.42851Z"
										fill={snap.user?.theme === "dark" ? "#fff" : "#262931"}
									/>
								</svg>
							</button>
						</>
					}
				/>
			</div>
		)
	);
}
