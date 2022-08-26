const get_current_date = () => {
    const curr_date = new Date();

    const day = curr_date.getDate();
    const month = curr_date.getMonth() + 1; 
    const year = curr_date.getFullYear();

    const hours = curr_date.getHours();
    const minutes = curr_date.getMinutes();
    const seconds = curr_date.getSeconds();

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}


module.exports = get_current_date;