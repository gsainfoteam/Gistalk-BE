export function AuthParse(obj_auth : any) {
    const obj = JSON.parse(JSON.stringify(obj_auth[0].authorities))
    const authName: any[] = [];
    for( var i = 0; i < obj.length; i++)
    {
        authName.push({name: obj[i].authorityName});
    }

    return authName
}


