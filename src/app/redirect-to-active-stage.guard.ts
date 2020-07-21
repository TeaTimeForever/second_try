import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Stage } from './stage/stage.model';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RedirectToActiveStageGuard implements CanActivate {
  constructor(private afs: AngularFirestore, private router: Router) { }
  canActivate(): Observable<UrlTree | boolean> {
    const year = new Date().getFullYear();
    return this.afs.collection<Stage>(`years/${year}/stages`, q => q.where('status', 'in', ['announced', 'ongoing']).orderBy('nr', 'asc').limit(1)).get().pipe(
      switchMap(stages => {
        if (stages.empty) {
          return this.afs.collectionGroup<Stage>('stages', q => q.where('status', '==', 'finished').orderBy('nr', 'desc').limit(1)).get().pipe(
            map(finishedStages => {
              if (finishedStages.empty) return true;
              const doc = finishedStages.docs[0];
              // Direct to the last finished stage
              return this.router.createUrlTree(['/stage', doc.ref.parent!.parent!.id, doc.ref.id]);
            })
          )
        }
        // If there's an ongoing stage, direct to it
        return of(this.router.createUrlTree(['/stage', year, stages.docs[0].id]));
      })
    );
  }
}
