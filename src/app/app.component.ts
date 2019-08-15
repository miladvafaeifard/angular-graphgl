import { Component, OnInit } from '@angular/core'
import { Apollo } from 'apollo-angular'
import { Observable } from 'rxjs'

import gql from 'graphql-tag'
import { map } from 'rxjs/operators'
import { Mutation, Post, Query } from './types'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Angular Apollo-GraphQL'
  posts: Observable<Post[]>

  constructor(private apollo: Apollo) {
  }

  ngOnInit(): void {
    this.posts = this.apollo.watchQuery<Query>({
      query: gql`
          query allPosts {
              posts {
                  id
                  title
                  votes
                  author {
                      id
                      firstName
                      lastName
                  }
              }
          }
      `,
    })
    .valueChanges
    .pipe(
      map((res: any) => res.data.posts),
    )
  }

  public voteUp(id) {
    this.apollo.mutate<Mutation>({
      mutation: gql`
          mutation upvotePost($postId: Int!) {
              upvotePost(postId: $postId) {
                  id
                  votes
              }
          }
      `,
      variables: {
        postId: id,
      },
    }).subscribe()
  }
}
