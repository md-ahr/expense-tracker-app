import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    changeTransaction,
    createTransaction,
} from "../features/transaction/transactionSlice";

const Form = () => {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [amount, setAmount] = useState("");

    const [editMode, setEditMode] = useState(false);

    const dispatch = useDispatch();

    const { isLoading, isError } = useSelector((state) => state.transaction);

    const { editing } = useSelector((state) => state.transaction) || {};

    // listen for edit mode active
    useEffect(() => {
        const { id, name, type, amount } = editing || {};
        if (id) {
            setEditMode(true);
            setName(name);
            setType(type);
            setAmount(amount);
        } else {
            setEditMode(false);
            resetForm();
        }
    }, [editing]);

    const resetForm = () => {
        setName("");
        setType("");
        setAmount("");
    };

    const handleCreate = (e) => {
        e.preventDefault();
        dispatch(createTransaction({ name, type, amount: +amount }));
        resetForm();
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        dispatch(
            changeTransaction({
                id: editing?.id,
                data: {
                    name: name,
                    type: type,
                    amount: amount,
                },
            })
        );
        setEditMode(false);
        resetForm();
    };

    const cancelEditMode = () => {
        setEditMode(false);
        resetForm();
    };

    return (
        <div className="form">
            <h3>Add new transaction</h3>

            <form onSubmit={editMode ? handleUpdate : handleCreate}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="Enter title"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-group radio">
                    <label htmlFor="type">Type</label>
                    <div className="radio_group">
                        <input
                            type="radio"
                            value="income"
                            name="type"
                            required
                            checked={type === "income"}
                            onChange={(e) => setType("income")}
                        />
                        <label htmlFor="type">Income</label>
                    </div>
                    <div className="radio_group">
                        <input
                            type="radio"
                            value="expense"
                            name="type"
                            required
                            placeholder="Expense"
                            checked={type === "expense"}
                            onChange={(e) => setType("expense")}
                        />
                        <label htmlFor="type">Expense</label>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        name="amount"
                        required
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={isLoading} className="btn">
                    {editMode ? "Update" : "Add"} Transaction
                </button>

                {!isLoading && isError && (
                    <p className="error">There was an error occured</p>
                )}
            </form>

            {editMode && (
                <button className="btn cancel_edit" onClick={cancelEditMode}>
                    Cancel Edit
                </button>
            )}
        </div>
    );
};

export default Form;
