type UseHandleKeyPressProps = {
    verification: boolean;
    key: string;
    callback: () => void;
};

function useHandleKeyPress(props: UseHandleKeyPressProps) {
    const { verification, callback, key } = props;

    return (event: KeyboardEvent) => {
        if (event.key === key) {
            if (verification) callback();
        }
    };
}

export default useHandleKeyPress;
