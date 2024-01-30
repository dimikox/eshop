import styles from "/app/page.module.css";

const Container = ({ children, ...props }) => {
    return (
        <div className={styles.container} {...props}>
            {children}
        </div>
    )
}

export default Container;
