import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { X } from 'lucide-react-native';
import { surveyService } from '@/services/survey.service';

interface SurveyModalProps {
  visible: boolean;
  onClose: () => void;
  surveyAnswerId: number;
  onSuccess: () => void;
}

export function SurveyModal({ visible, onClose, surveyAnswerId, onSuccess }: SurveyModalProps) {
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (score === null) {
      return;
    }

    try {
      setLoading(true);
      await surveyService.answerSurvey({
        enpsAnswerId: surveyAnswerId,
        feedback: feedback,
        score: score,
      });
      onSuccess();
      onClose();
      setScore(null);
      setFeedback('');
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setScore(null);
    setFeedback('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <X size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Çalışan Memnuniyet Anketi</Text>

            <Text style={styles.description}>
              Gelişmemize ve daha iyi bir çalışan deneyim sunmamıza yardımcı olduğunuz için teşekkür ederiz.
            </Text>

            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>
                1 - Şirketimizi iyi bir çalışma yeri olarak tavsiye eder misiniz?
              </Text>

              <View style={styles.scaleContainer}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={[
                      styles.scaleButton,
                      score === value && styles.scaleButtonSelected,
                    ]}
                    onPress={() => setScore(value)}
                  >
                    <Text
                      style={[
                        styles.scaleButtonText,
                        score === value && styles.scaleButtonTextSelected,
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.scaleLabelContainer}>
                <Text style={styles.scaleLabel}>TAVSİYE ETMEM</Text>
                <Text style={styles.scaleLabel}>TAVSİYE EDERİM</Text>
              </View>
            </View>

            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>2 - Yorum Girişi</Text>
              <TextInput
                style={styles.feedbackInput}
                placeholder="Herhangi bir konuda yorumunuz varsa girebilirsiniz."
                placeholderTextColor="#D1D5DB"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={feedback}
                onChangeText={setFeedback}
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Vazgeç</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                score === null && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={score === null || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Kaydet</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  scrollView: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 32,
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 32,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
    lineHeight: 24,
  },
  scaleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  scaleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scaleButtonSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#7C3AED',
  },
  scaleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  scaleButtonTextSelected: {
    color: '#fff',
  },
  scaleLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  scaleLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#1a1a1a',
    minHeight: 120,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingTop: 0,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
