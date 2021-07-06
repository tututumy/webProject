
 UNSAFE_componentWillMount() {
     if (getCookie('uop.locale') == 'fr_FR') {
         this.props.dispatch({
             type: 'windowModal/GetLanguages',
             payload: '_fr'
         });
     }
     else {
         this.props.dispatch({
             type: 'windowModal/GetLanguages',
             payload: '_zh'
         })
     }
 }

 document.cookie="uop.locale=fr_FR";
 document.cookie="uop.locale=zh_CN";
 const getCookie = (cname) => {
     var name = cname + "=";
     var ca = document.cookie.split(';');
     for (var i = 0; i < ca.length; i++) {
         var c = ca[i].trim();

         if (c.indexOf(name) === 0) {
             console.log(c.substring(name.length, c.length))
             return c.substring(name.length, c.length);
         }
     }
    return "";
}

export default getCookie;

