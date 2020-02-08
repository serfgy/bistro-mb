// empty, for platform specific import
export const LOCALE = () => {
    console.log('1st Priority', navigator.languages);
    console.log('2nd Priority', navigator.userLanguage);
    console.log('3rd Priority', navigator.language);
    console.log('4th Priority', navigator.browserLanguage);
    let temp = (navigator.languages && navigator.languages.length) ?
        navigator.languages[0]
        :
        navigator.userLanguage || navigator.language || navigator.browserLanguage;

    let temp2 = temp.split('-');

    // chinese case
    if (temp2[0].toLowerCase() === 'zh') {
        return 'zhs';
    }

    // all other case
    return 'en';
}