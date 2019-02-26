export class Menu {
  Men_Id: number;
  Men_Nombre: string;
  Men_Recurso: string;
  Men_Url: string;
  Men_Icono: string;
  Men_Orden: number;
  Men_Id_Padre: number;
  MenuHijos: Menu[];
}

export class UsuarioInfo {
  Resultado: number;
  Usu_Id: number;
  Usu_Token: string;
  Usu_Usuario: string;
  Usu_Nombre: string;
  Usu_Apellido: string;
  Usu_Mail: string;
  Usu_Imagen: string;
  Rec_Id: number;
  Rec_Archivo: string;
  Pai_Id: number;
  Usu_Apodo: string;
  Usu_OcultarMsjInicio: boolean;
  Usuario_Menu: Menu[];
}
