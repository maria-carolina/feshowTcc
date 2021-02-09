
class Format{
    static formatDate(date){
        const splitted = date.split('-');
        const formatted = `${splitted[2]}/${splitted[1]}/${splitted[0]}`
        return formatted;
    }

    static formatTime(time){
        const splitted = time.split(':');
        const formatted = `${splitted[0]}h${splitted[1]}`
    
        return formatted;
    }
}

export default Format;