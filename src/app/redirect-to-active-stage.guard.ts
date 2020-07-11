import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Stage } from './stage/stage.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RedirectToActiveStageGuard implements CanActivate {
  constructor(private afs: AngularFirestore, private router: Router) { }
  canActivate(): Observable<UrlTree | boolean> {
    const year = new Date().getFullYear();
    return this.afs.collection<Stage>(`years/${year}/stages`, q => q.where('status', 'in', ['announced', 'ongoing']).orderBy('nr', 'asc').limit(1)).get().pipe(
      map(stages => {
        if (stages.empty) {
          return true;
        }
        return this.router.createUrlTree(['/stage', year, stages.docs[0].id]);
      })
    )
  }
}
