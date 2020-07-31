import { Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Participant, HasId } from './participants/participant.model';
import { UserPublicData } from './user.service';

@Pipe({
  name: 'participantData'
})
export class ParticipantPublicDataPipe implements PipeTransform {
  constructor(private afs: AngularFirestore) {}

  transform(participant: HasId, ...args: any[]): any {
    return this.afs.doc<UserPublicData>(`users/${participant.id!}`).valueChanges()
  }

}
