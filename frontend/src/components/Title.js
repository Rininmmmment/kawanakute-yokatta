import styles from '@/styles/Title.module.css';

export default function Title({ title }) {
    return (
        <>
            <h1 className={styles.title}>{title}</h1>
        </>
    );
}
