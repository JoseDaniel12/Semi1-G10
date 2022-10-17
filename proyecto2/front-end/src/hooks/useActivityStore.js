import { useSelector, useDispatch } from "react-redux";
import { onChangeActive } from "../store/activity/activitySlice";

export const useActivityStore = () => {

    const dispatch = useDispatch();
    const { active } = useSelector(state => state.activity);

    const startChange = (activity) => {
        dispatch(onChangeActive(activity));
    }

    return {
        active,

        startChange,
    }
}
