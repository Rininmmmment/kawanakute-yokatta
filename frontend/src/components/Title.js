import styles from '@/styles/Title.module.css';

export default function Title({ title }) {
    return (
        <>
            <h2 className={styles.title}>{title}</h2>
        </>
    );
}
