import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { discussionRoute } from "../../AppRoutes";
import Alert from "../../components/Alert";
import CircularProgress from "../../components/CircularProgress";
import CommentBox from "../../components/Comments/CommentBox";
import Markdown from "../../components/Markdown";
import PageTitle from "../../components/PageTitle";
import TextBody from "../../components/TextBody";
import { Discussion } from "../../pb/discussions_pb";
import { service } from "../../service";

export default function DiscussionDiscussion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [discussion, setDiscussion] = useState<Discussion.AsObject | null>(
    null
  );

  const history = useHistory();

  const { discussionId, discussionSlug } = useParams<{
    discussionId: string;
    discussionSlug?: string;
  }>();

  useEffect(() => {
    if (!discussionId) return;
    (async () => {
      setLoading(true);
      try {
        const discussion = await service.discussions.getDiscussion(
          Number(discussionId)
        );
        if (discussion.slug !== discussionSlug) {
          history.push(
            `${discussionRoute}/${discussion.discussionId}/${discussion.slug}`
          );
        } else {
          setDiscussion(discussion);
        }
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
      setLoading(false);
    })();
  }, [discussionId, discussionSlug, history]);

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : discussion ? (
        <>
          <PageTitle>{discussion.title}</PageTitle>
          <p>
            Owner:{" "}
            {discussion.ownerCommunityId !== 0
              ? "community " + discussion.ownerGroupId
              : "group " + discussion.ownerGroupId}
          </p>
          <p>
            Created at {discussion.created?.seconds} by{" "}
            {discussion.creatorUserId}
          </p>
          <Markdown source={discussion.content} />
          <CommentBox threadId={discussion.threadId} />
        </>
      ) : (
        <TextBody>Error</TextBody>
      )}
    </>
  );
}
