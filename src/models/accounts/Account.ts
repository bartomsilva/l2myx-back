export interface AccountDB {
  login: string,
  password: string,
  secretquestion: string,
  questionresponse: string
  id_donate?: string,
  amount?: number,    
  qr_code?: string,
  qr_code_text?: string,  
  approved?: number,
  coin?: number,
  response?: string
}
 

