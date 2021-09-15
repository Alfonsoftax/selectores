import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable, of } from 'rxjs';

import { PaisSmall, Pais } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl: string = 'https://restcountries.eu/rest/v2'
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']; //opciones del select

  get regiones(): string[] { //me devuelve las regiones
    return [ ...this._regiones ];
  }

  constructor( private http: HttpClient ) { }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {

    const url: string = `${ this.baseUrl }/region/${ region }?fields=alpha3Code;name`
    return this.http.get<PaisSmall[]>( url ); //Me devuelve los paises del webservice PaisSmall es la interfaz
  }

  getPaisPorCodigo( codigo: string ): Observable<Pais | null> {  //recogemos un pais por el código 

    if (codigo ) {
      const url = `${ this.baseUrl }/alpha/${ codigo }`;
    return this.http.get<Pais>( url );
    }  else{
      return of (null);
    }
  }

  getPaisPorCodigoSmall( codigo: string ): Observable<PaisSmall> {   //recogemos las iniciales de los paises
    const url = `${ this.baseUrl }/alpha/${ codigo }?fields=alpha3Code;name`;
    return this.http.get<PaisSmall>( url );
  }

  getPaisesPorCodigos( borders: string[] ): Observable<PaisSmall[]> {

    if (borders) {
      const peticiones: Observable<PaisSmall>[] = [];

      borders.forEach( codigo => {
        const peticion = this.getPaisPorCodigoSmall(codigo);
        peticiones.push( peticion );
      });
  
      return combineLatest( peticiones );
    }

    return of([]);


  }


}
